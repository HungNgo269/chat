import { useState } from "react";
import { UserMinus, UserPlus } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

import DefaultLayout from "@/layouts/default";
import { useGetFriendRequests, useGetListFriends } from "@/hooks/api/useFriend";
import { friendRequest, UserAvatar } from "@/interfaces/user";
import { FriendRequestItem } from "@/components/user/friendRequestItem";
import { FriendListItem } from "@/components/user/friendListItem";

export const IndexPage = () => {
    const { data: listFriends } = useGetListFriends();
    const { data: friendRequests } = useGetFriendRequests();

    const [activeTab, setActiveTab] = useState<string>("list");

    return (
        <DefaultLayout>
            <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 gap-6">
                <h1 className="text-2xl font-bold text-center">
                    Quản lý bạn bè
                </h1>

                <div className="flex w-full flex-col">
                    <Tabs
                        aria-label="Friend Options"
                        classNames={{
                            tabList:
                                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-primary",
                            tab: "max-w-fit px-0 h-12",
                            tabContent:
                                "group-data-[selected=true]:text-primary-foreground",
                        }}
                        color="primary"
                        selectedKey={activeTab}
                        variant="underlined"
                        onSelectionChange={(key) => setActiveTab(key as string)}
                    >
                        <Tab
                            key="list"
                            title={
                                <div className="flex items-center space-x-2">
                                    <UserMinus size={18} />
                                    <span>Danh sách bạn bè</span>
                                    <Chip size="sm" variant="flat">
                                        {listFriends?.length}
                                    </Chip>
                                </div>
                            }
                        >
                            <Card className="shadow-none bg-transparent mt-4">
                                <CardBody className="p-0 gap-4">
                                    {!listFriends ? (
                                        <p className="text-center text-content1 py-10">
                                            Chưa có bạn bè nào.
                                        </p>
                                    ) : (
                                        listFriends?.map(
                                            (friend: UserAvatar) => (
                                                <FriendListItem
                                                    key={friend.id}
                                                    friend={friend}
                                                />
                                            ),
                                        )
                                    )}
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab
                            key="requests"
                            title={
                                <div className="flex items-center space-x-2">
                                    <UserPlus size={18} />
                                    <span>Lời mời kết bạn</span>
                                    {friendRequests?.length > 0 && (
                                        <Chip
                                            color="danger"
                                            size="sm"
                                            variant="solid"
                                        >
                                            {friendRequests?.length}
                                        </Chip>
                                    )}
                                </div>
                            }
                        >
                            <Card className="shadow-none bg-transparent mt-4">
                                <CardBody className="p-0 gap-4">
                                    {!friendRequests ? (
                                        <p className="text-center text-content1 py-10">
                                            Không có lời mời kết bạn nào.
                                        </p>
                                    ) : (
                                        friendRequests?.map(
                                            (req: friendRequest) => (
                                                <FriendRequestItem
                                                    key={req.id}
                                                    friend={req}
                                                />
                                            ),
                                        )
                                    )}
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </DefaultLayout>
    );
};
