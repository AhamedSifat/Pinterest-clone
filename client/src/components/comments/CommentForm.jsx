import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import apiRequest from './../../utils/apiRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addComment = async (comment) => {
  try {
    const res = await apiRequest.post('/comments', comment);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const CommentForm = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');

  const queryClient = useQueryClient();

  const handleEmojiClick = (emoji) => {
    setDescription((prev) => prev + emoji.emoji);
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', id],
      });
      setDescription('');
      setOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      description: description,
      pin: id,
    });
  };

  return (
    <form className='commentForm' onSubmit={handleSubmit}>
      <input
        type='text'
        value={description}
        placeholder='Add a comment'
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className='emoji'>
        <div onClick={() => setOpen((prev) => !prev)}>😊</div>
        {open && (
          <div className='emojiPicker'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
