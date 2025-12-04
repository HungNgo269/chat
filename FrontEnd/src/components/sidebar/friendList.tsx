import { Spinner } from "@heroui/spinner";

import FriendItem from "./friendItem";

import { User } from "@/interfaces/user";

interface props {
    friendList: User[];
    isLoading: boolean;
}

export const FriendList = ({ friendList, isLoading }: props) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner color="primary" size="lg" />
            </div>
        );
    }

    if (friendList.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <span className="text-default-400 text-sm">
                    Không tìm thấy kết quả
                </span>
            </div>
        );
    }

    return (
        <>
            {friendList.map((friend: User) => (
                <FriendItem key={friend.id} friend={friend} />
            ))}
        </>
    );
};
