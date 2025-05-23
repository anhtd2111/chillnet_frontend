import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import avatar from "../../assets/avatar.jpg"
import verifiedIcon from '../../assets/verified.png';
import ImageIcon from '@mui/icons-material/Image';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import postImg from "../../assets/post1.jpg"
import EmojiPicker from 'emoji-picker-react';
import video from '../../assets/video.mp4'
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { uploadToCloudinary } from '../../utils/UploadToCloudinary';
import { commentPost } from '../../redux/post/Action';
import { followUser } from '../../redux/user/Action';

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

export default function CommentModal({ handleClose, open, item }) {
  const [clickedFollow, setClickedFollow] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [openEmojiPicker, setOpenEmojiPicker] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store);
  const handleSubmit = (values) => {
    console.log("values: ", values);
    dispatch(commentPost(values));
    formik.resetForm();
    setSelectedFiles([]);
    handleClose();
  }
  const formik = useFormik({
    initialValues: {
      content: "",
      media: [],
      postId: item?.id
    },
    onSubmit: handleSubmit
  })
  const handleEmojiClick = (emojiObject) => {
    formik.setFieldValue("content", formik.values.content + emojiObject.emoji);
  }
  const handleSelectFile = async (event) => {
    const files = Array.from(event.target.files); // Lấy danh sách file

    if (files.length === 0) return;

    try {
      // Upload từng file lên Cloudinary
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          return await uploadToCloudinary(file); // Trả về URL trực tiếp
        })
      );

      // Cập nhật vào formik (giữ lại các file cũ + file mới)
      formik.setFieldValue("media", [...(formik.values.media || []), ...uploadedFiles]);

      // Cập nhật state để hiển thị ảnh/video đã upload
      setSelectedFiles(prev => [...prev, ...uploadedFiles]);


    } catch (error) {
      console.error("Lỗi upload file:", error);
    }
  };
  const handleFollowUser = () => {
    if (!clickedFollow) {
      setClickedFollow(true);
      dispatch(followUser(item?.user?.id));
    }
  }
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
                <h1 className='text-xl font-bold flex-1 text-center'>Comment</h1>
                <IconButton
                  onClick={handleClose}
                  className="hover:bg-gray-200 rounded-full"
                  size="small"
                >
                  <CloseIcon className="text-[#536471]" />
                </IconButton>
              </div>
            </section>
          </div>
          <div className='flex space-x-3 mt-4 px-4 '>

            <div className='relative pl-3'>
              <Avatar
                onClick={() => navigate(`/profile/${item?.user?.id}`)}
                className='cursor-pointer'
                alt="Username"
                src={item?.user.image}
                sx={{ width: 40, height: 40 }}
              />
              {/* Vertical connecting line */}
              <div className='absolute left-7.5 top-[50px] w-[2px] bg-[#e5e5e5] bottom-0'></div>
            </div>
            <div className='w-full'>
              <div className='flex justify-between items-start gap-2'>
                <div className='flex items-center flex-wrap'>
                  <span onClick={() => navigate(`/profile/${item?.user?.id}`)} className='cursor-pointer text-lg font-bold hover:underline'>
                    {item?.user?.username}
                  </span>
                  {item?.user.verified && <img className='ml-1 w-[17px] h-[17px]' src={verifiedIcon} alt="" />}
                  {!item?.user?.followed && !item?.user?.reqUser && (
                    <>
                      <span className='text-[#536471] text-[15px] mx-1'>·</span>
                      <span onClick={handleFollowUser}
                        className={`${clickedFollow ? "text-[#536471]" : "text-[#0095f6] "} font-semibold text-lg ${clickedFollow ? "" : "cursor-pointer hover:underline"} `}>
                        {clickedFollow ? "Followed" : "Follow"}
                      </span>
                    </>
                  )}
                  <span className='text-[#536471] text-[15px] mx-1'>·</span>
                  <span className='text-[#536471] text-[15px]'>{formatDistanceToNow(new Date(item?.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
              <div>
                <div

                  className='cursor-pointer'
                >
                  <p className='text-[18px] leading-5 break-words mb-3 pt-2'>
                    {item?.content}
                  </p>
                  {
                    item?.image && <div className='relative group rounded-2xl overflow-hidden mb-2 pr-3.5'>
                      <img
                        className='cursor-pointer w-[50%] h-full object-cover hover:brightness-90 transition-all rounded-2xl'
                        src={item?.image} alt=""
                      />
                      {/* <video
                        className="w-full h-auto rounded-xl"
                        controls={true}
                        autoPlay loop
                      >
                        <source src={video} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video> */}

                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          {/* <section>
                        <div className='text-[#536471] text-[15px] mb-2 ml-13'>
                            Replying to <span className='text-[#1d9bf0]'>@chilllover</span>
                        </div>
                    </section> */}
          <section className={`px-7 py-5`}>
            <div className='flex space-x-5'>
              <Avatar
                alt="Username"
                src={user.reqUser?.image}
                sx={{ width: 40, height: 40 }}
              />
              <div className='w-full'>
                {/* Replying to text */}

                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <input type='text' name="content" placeholder={`Post your comment`}
                      className={`border-none outline-none text-xl bg-transparent w-full`}
                      {...formik.getFieldProps("content")}
                    />
                    {formik.errors.content && formik.touched.content && (
                      <span className='text-red-500'>{formik.errors.content}</span>
                    )}
                  </div>
                  <div className='py-3 grid grid-cols-2 gap-3'>
                    {selectedFiles.map((file, index) => {
                      const isVideo = file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".avi");

                      return (
                        <div key={index} className="relative">
                          {isVideo ? (
                            <video controls className="w-full h-auto rounded-md">
                              <source src={file} type="video/mp4" />
                              Trình duyệt của bạn không hỗ trợ video.
                            </video>
                          ) : (
                            <img src={file} alt={`Upload ${index}`} className="w-full h-auto rounded-md" />
                          )}
                        </div>
                      );
                    })}

                  </div>
                  <div className='flex justify-between items-center mt-5'>
                    <div className='flex space-x-5 items-center'>
                      <label className='flex items-center space-x-2 rounded-full hover:bg-[#1d9bf0]/10 p-2 cursor-pointer transition-all'>
                        <ImageIcon className='text-[#536471]' />
                        <input type="file" name="imageFile" className='hidden' mutiple
                          onChange={handleSelectFile} />
                      </label>

                      <div className='rounded-full hover:bg-[#1d9bf0]/10 p-2 cursor-pointer transition-all'
                        onClick={() => setOpenEmojiPicker(true)} // Mở modal khi click
                      >
                        <TagFacesIcon className='text-[#536471]' />
                      </div>
                    </div>
                    <div>
                      <Button
                        sx={{
                          width: "100%",
                          borderRadius: "20px",
                          paddingY: "8px",
                          paddingX: "30px",
                          backgroundImage: "linear-gradient(to right, blue, purple)", // Gradient xanh dương và tím
                          color: "#ffffff",
                          textTransform: "none",
                          fontSize: "15px",
                          fontWeight: "bold",
                          opacity: 0.7,
                          "&:hover": {
                            opacity: 1// Giữ gradient khi hover
                          },
                          "&:disabled": {
                            bgcolor: "#333333", // Màu cho khi nút bị disable
                            opacity: 0.5,
                            color: "#ffffff"
                          }
                        }}
                        disabled={!formik.values.content && !formik.values.image}
                        type='submit'
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
      <section>
        <Modal
          open={openEmojiPicker}
          onClose={() => setOpenEmojiPicker(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            boxShadow: 24,
            p: 2,
            borderRadius: '10px'
          }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        </Modal>
      </section>
    </div>
  );
}