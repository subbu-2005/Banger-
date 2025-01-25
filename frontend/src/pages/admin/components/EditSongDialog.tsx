// frontend/src/pages/admin/components/EditSongDialog.tsx

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface EditSongDialogProps {
    song: Song;
}

const EditSongDialog = ({ song }: EditSongDialogProps) => {
    const { albums } = useMusicStore();
    const [songDialogOpen, setSongDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [updatedSong, setUpdatedSong] = useState({
        title: song.title,
        artist: song.artist,
        album: song.albumId || "",
        duration: song.duration,
    });

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
        audio: null,
        image: null,
    });

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", updatedSong.title);
            formData.append("artist", updatedSong.artist);
            formData.append("duration", updatedSong.duration);
            if (updatedSong.album && updatedSong.album !== "none") {
                formData.append("albumId", updatedSong.album);
            }
            if (files.audio) {
                formData.append("audioFile", files.audio);
            }
            if (files.image) {
                formData.append("imageFile", files.image);
            }

            await axiosInstance.put(`/admin/songs/${song._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Song updated successfully");
            setSongDialogOpen(false);
        } catch (error: any) {
            toast.error("Failed to update song: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Edit</Button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
                <DialogHeader>
                    <DialogTitle>Edit Song</DialogTitle>
                    <DialogDescription>Edit the details of the song</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    <input
                        type='file'
                        accept='audio/*'
                        ref={audioInputRef}
                        hidden
                        onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
                    />

                    <input
                        type='file'
                        ref={imageInputRef}
                        className='hidden'
                        accept='image/*'
                        onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
                    />

                    {/* image upload area */}
                    <div
                        className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className='text-center'>
                            {files.image ? (
                                <div className='space-y-2'>
                                    <div className='text-sm text-zinc-400 mb-2'>{files.image.name}</div>
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
                        <label className='text-sm font-medium'>Title</label>
                        <Input
                            value={updatedSong.title}
                            onChange={(e) => setUpdatedSong({ ...updatedSong, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Artist</label>
                        <Input
                            value={updatedSong.artist}
                            onChange={(e) => setUpdatedSong({ ...updatedSong, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Duration (seconds)</label>
                        <Input
                            type='number'
                            min='0'
                            value={updatedSong.duration}
                            onChange={(e) => setUpdatedSong({ ...updatedSong, duration: e.target.value || "0" })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Album (Optional)</label>
                        <Select
                            value={updatedSong.album}
                            onValueChange={(value) => setUpdatedSong({ ...updatedSong, album: value })}
                        >
                            <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                                <SelectValue placeholder='Select album' />
                            </SelectTrigger>
                            <SelectContent className='bg-zinc-800 border-zinc-700'>
                                <SelectItem value='none'>No Album (Single)</SelectItem>
                                {albums.map((album) => (
                                    <SelectItem key={album._id} value={album._id}>
                                        {album.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Song"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditSongDialog;