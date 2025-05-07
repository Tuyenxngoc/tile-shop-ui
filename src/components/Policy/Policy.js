import images from '~/assets';
import classNames from 'classnames';

function Policy({ className }) {
    return (
        <div className={classNames(className)}>
            <div className="row">
                <div className="col-6 col-md-3">
                    <img className="img-fluid" src={images.group5} alt="Chính sách khách hàng" />
                </div>
                <div className="col-6 col-md-3">
                    <img className="img-fluid" src={images.group6} alt="Chính sách khách hàng" />
                </div>
                <div className="col-6 col-md-3">
                    <img className="img-fluid" src={images.group7} alt="Chính sách khách hàng" />
                </div>
                <div className="col-6 col-md-3">
                    <img className="img-fluid" src={images.group8} alt="Chính sách khách hàng" />
                </div>
            </div>
        </div>
    );
}

export default Policy;
