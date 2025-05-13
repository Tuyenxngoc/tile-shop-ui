import { Link } from 'react-router-dom';

import useStore from '~/hooks/useStore';
import SlideProduct from '~/components/SlideProduct';
import Carousel from '~/components/Carousel';
import Policy from '~/components/Policy';
import SlideNew from '~/components/SlideNew';
import PopularCategories from '~/components/PopularCategories';

function Home() {
    const {
        storeInfo: { bannerLink, bannerImage, backgroundImage, backgroundColor },
    } = useStore();

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundColor: backgroundColor,
                    backgroundSize: '100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPositionX: 'center',
                }}
            >
                <div className="container pb-3">
                    <Link to={bannerLink}>
                        <img src={bannerImage} className="img-fluid" alt="Hình ảnh banner" />
                    </Link>
                    <Carousel />
                </div>
            </div>

            <div style={{ backgroundColor: backgroundColor }}>
                <div className="container">
                    <Policy className="mb-3" />

                    <PopularCategories className="mb-3" />

                    <SlideProduct className="mb-3" />

                    <SlideProduct className="mb-3" />

                    <SlideProduct className="mb-3" />

                    <SlideNew />
                </div>
            </div>
        </>
    );
}

export default Home;
