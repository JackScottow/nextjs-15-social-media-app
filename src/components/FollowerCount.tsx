"use client";
import useFollowerInfo from "@/hooks/userFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      {formatNumber(data.followers)}{" "}
      {data.followers === 1 ? "Follower" : "Followers"}
    </span>
  );
};

export default FollowerCount;
