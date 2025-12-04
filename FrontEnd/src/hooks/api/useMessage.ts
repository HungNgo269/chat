import { useInfiniteQuery } from "@tanstack/react-query";

import { messageApi } from "@/api/messages.api";

export const useMessages = (conversationId: string | undefined) => {
    return useInfiniteQuery({
        queryKey: ["messages", conversationId],
        queryFn: ({ pageParam = 1 }) =>
            messageApi.getMessage({
                conversationId: conversationId!,
                page: pageParam,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage && lastPage.length > 0) {
                return allPages.length + 1;
            }

            return undefined;
        },

        enabled: !!conversationId,
        initialPageParam: 1,
    });
};
//infinite params của react-query trả về data kiểu:
// {
//   data: {
//     pages: [
//        // Kết quả của lần gọi messageApi.getMessage(page 1)
//        // Kết quả của lần gọi messageApi.getMessage(page 2)
//        // ...
//     ],
//     pageParams: [1, 2, ...]
//   },
//   ... // các hàm khác như fetchNextPage, isLoading
// }
