import images from '~/assets';
import './test.css';

function Contact({ contactNumber }) {
    return (
        <div id="button-contact-vr" className="">
            <div id="gom-all-in-one">
                <div id="zalo-vr" className="button-contact">
                    <div className="phone-vr">
                        <div className="phone-vr-circle-fill" />
                        <div className="phone-vr-img-circle">
                            <a target="_blank" rel="noreferrer" href={`https://zalo.me/${contactNumber}`}>
                                <img src={images.zalo} alt="zalo" />
                            </a>
                        </div>
                    </div>
                </div>
                <div id="phone-vr" className="button-contact">
                    <div className="phone-vr">
                        <div className="phone-vr-circle-fill" />
                        <div className="phone-vr-img-circle">
                            <a href={`tel:${contactNumber}`}>
                                <img src={images.phone} alt="phone" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
