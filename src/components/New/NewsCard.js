import { FaClock } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { formatDate } from '~/utils';

function NewsCard({ news, className }) {
    return (
        <div className={className}>
            <Link to={`/tin-tuc/${news.slug}`}>
                <img src={news.imageUrl} alt={news.title} className="img-fluid rounded-3" />
            </Link>

            <div>
                <Link to={`/tin-tuc/${news.slug}`} className="text-dark fs-5 text-decoration-none">
                    <h3 className="fw-semibold fs-6 mb-3">{news.title}</h3>
                </Link>
                <div className="small text-muted d-flex align-items-center gap-2">
                    <FaClock />
                    {formatDate(news.createdDate)}
                    &nbsp;&nbsp; Admin
                </div>
            </div>
        </div>
    );
}

export default NewsCard;
