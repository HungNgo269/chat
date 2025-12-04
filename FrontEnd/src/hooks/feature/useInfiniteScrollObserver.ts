import { useEffect, RefObject } from "react";

interface UseInfiniteScrollObserverProps {
    triggerRef: RefObject<HTMLDivElement>;
    containerRef: RefObject<HTMLDivElement>;
    onLoadMore: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}

export const useInfiniteScrollObserver = ({
    triggerRef,
    containerRef,
    onLoadMore,
    hasNextPage,
    isFetchingNextPage,
}: UseInfiniteScrollObserverProps) => {
    useEffect(() => {
        if (!triggerRef.current || !containerRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (
                    entry.isIntersecting &&
                    !isFetchingNextPage &&
                    hasNextPage
                ) {
                    onLoadMore();
                }
            },
            {
                root: containerRef.current,
                rootMargin: "0px",
                threshold: 0.1,
            },
        );

        observer.observe(triggerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [triggerRef, containerRef, onLoadMore, hasNextPage, isFetchingNextPage]);
};
