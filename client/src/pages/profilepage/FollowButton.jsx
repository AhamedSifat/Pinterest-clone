import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';

const followUser = async (username) => {
  try {
    const res = await apiRequest.post(`/users/follow/${username}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const FollowButton = ({ isFollowing, username }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile', username],
      });
    },
  });
  return (
    <button
      onClick={() => mutation.mutate(username)}
      disabled={mutation.isPending}
    >
      {isFollowing ? 'unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
