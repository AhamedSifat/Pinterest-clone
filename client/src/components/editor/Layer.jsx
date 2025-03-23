import useEditorStore from '../../store/useEditorStore';
import Image from './../image/Image';
const Layer = ({ previewImg }) => {
  const { selectedLayer, setSelectedLayer, addText, canvasOptions } =
    useEditorStore();

  const handleSelectedLayeer = (layer) => {
    setSelectedLayer(layer);
    if (layer === 'text') {
      addText();
    }
  };
  return (
    <div className='layers'>
      <div className='layerTitle'>
        <h3>Layers</h3>
        <p>Select a layer to edit</p>
      </div>
      <div
        onClick={() => handleSelectedLayeer('text')}
        className={`layer ${selectedLayer === 'text' ? 'selected' : ''}`}
      >
        <div className='layerImg'>
          <Image path='/general/text.png' w={48} h={48} />
        </div>
        <span>Add text</span>
      </div>

      <div
        onClick={() => handleSelectedLayeer('canvas')}
        className={`layer ${selectedLayer === 'canvas' ? 'selected' : ''}`}
      >
        <div
          className='layerImg'
          style={{
            backgroundColor: canvasOptions.backgroundColor,
          }}
        ></div>
        <span>Canvas</span>
      </div>
    </div>
  );
};

export default Layer;
