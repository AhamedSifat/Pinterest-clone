import { useEffect, useRef } from 'react';
import useEditorStore from '../../store/useEditorStore';
import Image from './../image/Image';

const WorkSpace = ({ previewImg }) => {
  const {
    textOptions,
    setTextOptions,
    setSelectedLayer,
    setCanvasOptions,
    canvasOptions,
  } = useEditorStore();

  useEffect(() => {
    if (canvasOptions.height === 0) {
      const canvasHeight = (375 * previewImg.height) / previewImg.width;
      setCanvasOptions({
        ...canvasOptions,
        height: canvasHeight,
        orientation: canvasHeight > 375 ? 'portrait' : 'landscape',
      });
    }
  }, [previewImg, canvasOptions, setCanvasOptions]);

  const itemRef = useRef(null);
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // console.log(offset.current);

  const handleMouseDown = (e) => {
    dragging.current = true;
    setSelectedLayer('text');
    offset.current = {
      x: e.clientX - textOptions.left,
      y: e.clientY - textOptions.top,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      setTextOptions({
        ...textOptions,
        left: e.clientX - offset.current.x,
        top: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseLeave = (e) => {
    dragging.current = false;
  };

  const handleMouseUp = (e) => {
    dragging.current = false;
  };

  return (
    <div className='workspace'>
      <div
        className='canvas'
        style={{
          height: canvasOptions.height,
          backgroundColor: canvasOptions.backgroundColor,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        ref={containerRef}
      >
        <img src={previewImg.url} alt='' />
        {textOptions.text && (
          <div
            className='text'
            style={{
              left: textOptions.left,
              top: textOptions.top,
              fontSize: `${textOptions.fontSize}px`,
            }}
            onMouseDown={handleMouseDown}
            ref={itemRef}
          >
            <input
              type='text'
              value={textOptions.text}
              onChange={(e) =>
                setTextOptions({
                  ...textOptions,
                  text: e.target.value,
                })
              }
              style={{
                color: textOptions.color,
              }}
            />
            <div
              className='deleteTextButton'
              onClick={() => setTextOptions({ ...textOptions, text: '' })}
            >
              <Image path='/general/delete.svg' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkSpace;
