import classNames from 'classnames/bind';
import styles from './DashboardCard.module.scss';
const cx = classNames.bind(styles);

function DashboardCard({ title, value, percent, index, isActive, onClick }) {
    return (
        <div onClick={() => onClick(index)} className={cx('card-wrap')}>
            <div className={cx('card', 'cardWrap', { activeCard: isActive }, 'p-3', 'shadow-sm')}>
                <div className="d-flex align-items-center mb-2">
                    <strong className="me-1">{title}</strong>
                    <span title="Thông tin thêm" className="text-muted">
                        ⓘ
                    </span>
                </div>
                <div className="fs-4 fw-bold">{value}</div>
                <div className="text-muted small">so với tuần trước</div>
                <div className="text-muted small">{percent}</div>
            </div>
        </div>
    );
}

export default DashboardCard;
