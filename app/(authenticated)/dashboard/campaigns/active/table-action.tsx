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
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeCampaignStatus, useDeleteCampaign } from "@/hooks/campaigns";
import { DialogDescription } from "@radix-ui/react-dialog";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { LoaderIcon } from "lucide-react";

interface TableActionProps {
    campaignId: string;
    status: string;
}
export const CampaignTableActions = ({
    campaignId,
    status,
}: TableActionProps) => {
    const { mutate: deleteCampaign, isPending: deleteCampaignIsPending } =
        useDeleteCampaign();

    const {
        mutate: changeCampaignStatus,
        isPending: changeCampaignStatusIsPending,
    } = useChangeCampaignStatus();

    const currentStatus = status.toLowerCase();

    return (
        <div className="flex items-center space-x-2">
            <CampaignCreationDialog mode="edit" campaignId={campaignId} />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
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
                        <Button
                            variant="destructive"
                            onClick={() => deleteCampaign(campaignId)}
                        >
                            Delete
                            {deleteCampaignIsPending && (
                                <LoaderIcon className="h-5 w-5 animate-spin" />
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        Change Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                        value={currentStatus}
                        onValueChange={(value) =>
                            changeCampaignStatus({ campaignId: campaignId, status: value })
                        }
                    >
                        <DropdownMenuRadioItem
                            value="active"
                            disabled={
                                currentStatus === "active" || changeCampaignStatusIsPending
                            }
                        >
                            Active
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            value="paused"
                            disabled={
                                currentStatus === "paused" || changeCampaignStatusIsPending
                            }
                        >
                            Paused
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            value="draft"
                            disabled={
                                currentStatus === "draft" || changeCampaignStatusIsPending
                            }
                        >
                            Draft
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
