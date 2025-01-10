import { CampaignCreationDialog } from "@/components/campaign/create-campaign";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCampaign } from "@/hooks/campaigns";
import { DialogDescription } from "@radix-ui/react-dialog";
import { LoaderIcon } from "lucide-react";

interface TableActionProps {
    value: string;
}
export const CampaignTableActions = ({ value }: TableActionProps) => {
    const { mutate: deleteCampaign, isPending: deleteCampaignIsPending } = useDeleteCampaign();

    return (
        <div className="flex items-center space-x-2">
            <CampaignCreationDialog mode="edit" campaignId={value} />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log("Delete", value)}
                    >
                        Delete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Campaign</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this campaign?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => console.log("Cancel")}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={() => deleteCampaign(value)}>
                            Delete
                            { deleteCampaignIsPending && <LoaderIcon className="h-5 w-5 animate-spin" /> }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
