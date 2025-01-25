import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Clock, Trash2 } from "lucide-react";
import { useEffect } from "react";
import EditSongDialog from "./EditSongDialog";

const SongsTable = () => {
    const { songs, deleteSong, fetchSongs } = useMusicStore();

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-zinc-800/50'>
                    <TableHead className='w-[50px]'></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {songs.map((song) => (
                    <TableRow key={song._id} className='hover:bg-zinc-800/50'>
                        <TableCell>
                            <img src={song.imageUrl} alt={song.title} className='w-10 h-10 rounded object-cover' />
                        </TableCell>
                        <TableCell className='font-medium'>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>
                            <span className='inline-flex items-center gap-1 text-zinc-400'>
                                <Clock className='h-4 w-4' />
                                {formatDuration(song.duration)}
                            </span>
                        </TableCell>
                        <TableCell className='text-right'>
                            <div className='flex gap-2 justify-end'>
                                <EditSongDialog song={song} />
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => deleteSong(song._id)}
                                    className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                >
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SongsTable;