import './CreatePage.css';
import IKImage from './../../components/image/Image';
import useAuthStore from './../../store/useAuthStore';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../../components/editor/Editor';
import useEditorStore from '../../store/useEditorStore';
import apiRequest from './../../utils/apiRequest';

const CreatePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [file, setFile] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [previewImg, setPreviewImg] = useState({
    url: '',
    width: 0,
    height: 0,
  });

  const { textOptions, canvasOptions } = useEditorStore();

  const formRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/path');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const img = new Image();
    img.src = file ? URL.createObjectURL(file) : null;
    img.onload = () => {
      setPreviewImg({
        url: URL.createObjectURL(file),
        width: img.width,
        height: img.height,
      });
    };
  }, [file]);

  const handleSubmit = async () => {
    if (isEdit) {
      setEdit(false);
    } else {
      // submit
      const formdata = new FormData(formRef.current);
      formdata.append('media', file);
      formdata.append('textOptions', JSON.stringify(textOptions));
      formdata.append('canvasOptions', JSON.stringify(canvasOptions));

      try {
        const res = await apiRequest.post('/pins', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        navigate(`/pin/${res.data._id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className='createPage'>
      <div className='createTop'>
        <h1>{isEdit ? 'Design your Pin' : 'Create Pin'}</h1>
        <button onClick={handleSubmit}>{isEdit ? 'Done' : 'Publish'}</button>
      </div>

      {isEdit ? (
        <Editor previewImg={previewImg} />
      ) : (
        <div className='createBottom'>
          {previewImg.url ? (
            <div className='preview'>
              <img src={previewImg.url} alt='' />
              <div className='editIcon' onClick={() => setEdit(true)}>
                <IKImage path='/general/edit.svg' />
              </div>
            </div>
          ) : (
            <>
              <label htmlFor='file' className='upload'>
                <div className='uploadTitle'>
                  <IKImage path='/general/edit.svg' />
                  <span>Choose a file</span>
                </div>
                <div className='uploadInfo'>
                  We recommend using high quality .jpg files less than 20 files
                  less than 200 MB
                </div>
              </label>
            </>
          )}

          <input
            hidden
            type='file'
            id='file'
            onChange={(e) => setFile(e.target.files[0])}
          />

          <form className='createForm' ref={formRef}>
            <div className='createFormItem'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                name='title'
                placeholder='Add a title'
                id='title'
              />
            </div>
            <div className='createFormItem'>
              <label htmlFor='description'>Description</label>
              <textarea
                type='text'
                rows={6}
                name='description'
                placeholder='Add a detail description'
                id='description'
              />
            </div>

            <div className='createFormItem'>
              <label htmlFor='link'>Link</label>
              <input
                type='text'
                name='link'
                placeholder='Add a link'
                id='link'
              />
            </div>

            <div className='createFormItem'>
              <label htmlFor='board'>Board</label>
              <select name='board' id='board'>
                <option value=''>Choose a board</option>
                <option value='60af884f12e4f541d4a5b678'>Board 1</option>
                <option value='60af885f12e4f541d4a5b679'>Board 2</option>
                <option value='60af886f12e4f541d4a5b680'>Board 3</option>
              </select>
            </div>

            <div className='createFormItem'>
              <label htmlFor='tags'>Tagged topics</label>
              <input type='text' name='tags' placeholder='Add tags' id='tags' />
              <small>Don&apos;t worry, people won&apos;t see your tags</small>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePage;
