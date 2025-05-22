import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import ListUser from './ListUser';
import { getListLikes } from '../../redux/post/Action';
import { Avatar } from '@mui/material';
import { List } from 'lucide-react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  // p:4,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  outline: 'none',
  borderRadius: 4,
  maxHeight: '95vh', // Giới hạn chiều cao của modal
  overflowY: 'auto',
  scrollbarWidth: 'none', // Ẩn scrollbar trên Firefox
  msOverflowStyle: 'none'
};

export default function ListLikeModal({ handleClose, open, item }) {
  const {post, user} = useSelector(store => store);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (open) {
      dispatch(getListLikes(item.id));
    }
  }, [open]);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='bg-white/80 backdrop-blur-md sticky top-0 z-10'>
            <section className={`px-4 py-4 border-b border-gray-100`}>
              <div className='flex items-center space-x-4'>
                <h1 className='text-xl font-bold flex-1 text-center'>List Likes</h1>
                <IconButton
                  onClick={handleClose}
                  className="hover:bg-gray-200 rounded-full"
                  size="small"
                >
                  <CloseIcon className="text-[#536471]" />
                </IconButton>
              </div>
            </section>
            <section>
              {post.likes?.map(item => (<ListUser key={item.id} item={item?.user} />))}
            </section>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
