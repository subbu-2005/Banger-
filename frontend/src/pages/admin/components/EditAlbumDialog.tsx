// frontend/src/pages/admin/components/EditAlbumDialog.tsx

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface EditAlbumDialogProps {
    album: Album;
}

const EditAlbumDialog = ({ album }: EditAlbumDialogProps) => {
    const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [updatedAlbum, setUpdatedAlbum] = useState({
        title: album.title,
        artist: album.artist,
        releaseYear: album.releaseYear,
    });

    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", updatedAlbum.title);
            formData.append("artist", updatedAlbum.artist);
            formData.append("releaseYear", updatedAlbum.releaseYear.toString());
            if (imageFile) {
                formData.append("imageFile", imageFile);
            }

            await axiosInstance.put(`/admin/albums/${album._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Album updated successfully");
            setAlbumDialogOpen(false);
        } catch (error: any) {
            toast.error("Failed to update album: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Edit</Button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700'>
                <DialogHeader>
                    <DialogTitle>Edit Album</DialogTitle>
                    <DialogDescription>Edit the details of the album</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    <input
                        type='file'
                        ref={imageInputRef}
                        onChange={handleImageSelect}
                        accept='image/*'
                        className='hidden'
                    />
                    <div
                        className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className='text-center'>
                            {imageFile ? (
                                <div className='space-y-2'>
                                    <div className='text-sm text-zinc-400 mb-2'>{imageFile.name}</div>
                                </div>
                            ) : (
                                <div className='text-sm text-zinc-400 mb-2'>Upload new album artwork</div>
                            )}
                            <Button variant='outline' size='sm' className='text-xs'>
                                Choose File
                            </Button>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Album Title</label>
                        <Input
                            value={updatedAlbum.title}
                            onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter album title'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Artist</label>
                        <Input
                            value={updatedAlbum.artist}
                            onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter artist name'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Release Year</label>
                        <Input
                            type='number'
                            value={updatedAlbum.releaseYear}
                            onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, releaseYear: parseInt(e.target.value) })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter release year'
                            min={1900}
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => setAlbumDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Album"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditAlbumDialog;