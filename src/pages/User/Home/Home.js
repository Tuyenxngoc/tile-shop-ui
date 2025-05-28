import { Link } from 'react-router-dom';

import useStore from '~/hooks/useStore';
import SlideProduct from '~/components/SlideProduct';
import Carousel from '~/components/Carousel';
import Policy from '~/components/Policy';
import SlideNew from '~/components/SlideNew';
import PopularCategories from '~/components/PopularCategories';
import { getProducts } from '~/services/productService';
import { getBrands } from '~/services/brandService';
import usePageTracking from '~/hooks/usePageTracking';

function Home() {
    const {
        storeInfo: { bannerLink, bannerImage, backgroundImage, backgroundColor },
    } = useStore();

    usePageTracking({ url: 'trang-chu', delay: 5000 });

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

            <div style={{ backgroundColor: backgroundColor, overflow: 'hidden' }}>
                <div className="container">
                    <Policy className="mb-3" />

                    <PopularCategories className="mb-3" />

                    <SlideProduct
                        className="mb-3"
                        title="Bồn Cầu"
                        fetchProducts={getProducts}
                        productFilterParams={{ searchBy: 'categorySlug', keyword: 'bon-cau', pageSize: 20 }}
                        fetchBrands={getBrands}
                        brandFilterParams={{ pageSize: 5 }}
                        viewAllLink="/danh-muc/bon-cau"
                    />

                    <SlideProduct
                        className="mb-3"
                        title="Bồn Tắm"
                        fetchProducts={getProducts}
                        productFilterParams={{ searchBy: 'categorySlug', keyword: 'bon-tam', pageSize: 20 }}
                        fetchBrands={getBrands}
                        brandFilterParams={{ pageSize: 5 }}
                        viewAllLink="/danh-muc/bon-tam"
                    />

                    <SlideProduct
                        className="mb-3"
                        title="Gạch Lát Nền"
                        fetchProducts={getProducts}
                        productFilterParams={{ searchBy: 'categorySlug', keyword: 'gach-lat-nen', pageSize: 20 }}
                        fetchBrands={getBrands}
                        brandFilterParams={{ pageSize: 5 }}
                        viewAllLink="/danh-muc/gach-lat-nen"
                    />

                    <SlideNew className="mb-3" />
                </div>
            </div>
        </>
    );
}

export default Home;
