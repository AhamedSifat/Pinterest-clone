import { IKImage } from 'imagekitio-react';

const Image = ({ path, src, className, w, h }) => {
  const urlEndpoint = 'https://ik.imagekit.io/1zd5xlacjp';

  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      path={path}
      src={src}
      transformation={[{ width: w, height: h }]}
      loading='lazy'
      alt=''
      className={className}
      lqip={{ active: true, quality: 20 }}
    />
  );
};

export default Image;
