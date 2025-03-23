import { useState } from 'react';
import useEditorStore from './../../store/useEditorStore';
import { HexColorPicker } from 'react-colorful';

const portraitSizes = [
  {
    name: '1:2',
    width: 1,
    height: 2,
  },
  {
    name: '9:16',
    width: 9,
    height: 16,
  },
  {
    name: '2:3',
    width: 2,
    height: 3,
  },
  {
    name: '3:4',
    width: 3,
    height: 4,
  },
  {
    name: '4:5',
    width: 4,
    height: 5,
  },
  {
    name: '1:1',
    width: 1,
    height: 1,
  },
];

const landscapeSizes = [
  {
    name: '2:1',
    width: 2,
    height: 1,
  },
  {
    name: '16:9',
    width: 16,
    height: 9,
  },
  {
    name: '3:2',
    width: 3,
    height: 2,
  },
  {
    name: '4:3',
    width: 4,
    height: 3,
  },
  {
    name: '5:4',
    width: 5,
    height: 4,
  },
  {
    name: '1:1',
    width: 1,
    height: 1,
  },
];

const Options = ({ previewImg }) => {
  const {
    selectedLayer,
    textOptions,
    setTextOptions,
    canvasOptions,
    setCanvasOptions,
  } = useEditorStore();
  const [colorOpen, setColorOpen] = useState(false);

  const originalOrientation =
    previewImg.width > previewImg.height ? 'landscape' : 'portrait';

  const handleSizeChange = (size) => {
    let canvasHeight;

    if (size === 'original') {
      if (
        (originalOrientation === 'portrait' &&
          canvasOptions.orientation === 'portrait') ||
        (originalOrientation === 'landscape' &&
          canvasOptions.orientation === 'landscape')
      ) {
        canvasHeight = (375 * previewImg.height) / previewImg.width;
      } else {
        canvasHeight = (375 * previewImg.width) / previewImg.height;
      }
    } else {
      canvasHeight = (375 * size.height) / size.width;
    }

    setCanvasOptions({
      ...canvasOptions,
      height: canvasHeight,
      size: size.name,
    });
  };

  const handleOrientationChange = (orientation) => {
    let canvasHeight;

    if (
      (originalOrientation === 'portrait' && orientation === 'portrait') ||
      (originalOrientation === 'landscape' && orientation === 'landscape')
    ) {
      canvasHeight = (375 * previewImg.height) / previewImg.width;
    } else {
      canvasHeight = (375 * previewImg.width) / previewImg.height;
    }

    setCanvasOptions({
      ...canvasOptions,
      height: canvasHeight,
      orientation,
      size: 'Original',
    });
  };

  return (
    <div className='options'>
      {selectedLayer === 'text' ? (
        <div className=''>
          <div className='editingOption'>
            <span>Font Size</span>
            <input
              type='number'
              value={textOptions.fontSize}
              onChange={(e) =>
                setTextOptions({ ...textOptions, fontSize: e.target.value })
              }
            />
          </div>

          <div className='editingOption'>
            <span>Color</span>
            <div className='textColor'>
              <div
                className='colorPreview'
                style={{ backgroundColor: textOptions.color }}
                onClick={() => setColorOpen((prev) => !prev)}
              />

              {colorOpen && (
                <div className='colorPicker'>
                  <HexColorPicker
                    color={textOptions.color}
                    onChange={(color) =>
                      setTextOptions({ ...textOptions, color })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className=''>
          <div className='editingOption'>
            <span>Orientation</span>
            <div className='orientations'>
              <div
                className={`orientation ${
                  canvasOptions.orientation === 'portrait' ? 'selected' : ''
                }`}
                onClick={() => handleOrientationChange('portrait')}
              >
                P
              </div>
              <div
                className={`orientation ${
                  canvasOptions.orientation === 'landscape' ? 'selected' : ''
                }`}
                onClick={() => handleOrientationChange('landscape')}
              >
                L
              </div>
            </div>
          </div>

          <div className='editingOption'>
            <span>Size</span>
            <div className='sizes'>
              <div
                onClick={() => handleSizeChange('original')}
                className={`size ${
                  canvasOptions.size === 'Original' ? 'selected' : ''
                }`}
              >
                Original
              </div>
              {canvasOptions.orientation === 'portrait'
                ? portraitSizes.map((size) => (
                    <div
                      className={`size ${
                        canvasOptions.size === size.name ? 'selected' : ''
                      }`}
                      key={size.name}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size.name}
                    </div>
                  ))
                : landscapeSizes.map((size) => (
                    <div
                      className={`size ${
                        canvasOptions.size === size.name ? 'selected' : ''
                      }`}
                      key={size.name}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size.name}
                    </div>
                  ))}
            </div>
          </div>

          <div className='editingOption'>
            <span>Background Color</span>
            <div className='bgColor'>
              <div
                className='colorPreview'
                style={{ backgroundColor: canvasOptions.backgroundColor }}
                onClick={() => setColorOpen((prev) => !prev)}
              />

              {colorOpen && (
                <div className='colorPicker'>
                  <HexColorPicker
                    color={canvasOptions.backgroundColor}
                    onChange={(color) =>
                      setCanvasOptions({
                        ...canvasOptions,
                        backgroundColor: color,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
