import './Editor.css';
import Layer from './Layer';
import Options from './Options';
import WorkSpace from './WorkSpace';

const Editor = ({ previewImg }) => {
  return (
    <div className='editor'>
      <Layer previewImg={previewImg} />
      <WorkSpace previewImg={previewImg} />
      <Options previewImg={previewImg} />
    </div>
  );
};

export default Editor;
