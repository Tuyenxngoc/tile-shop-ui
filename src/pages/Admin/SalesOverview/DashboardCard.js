import classNames from 'classnames/bind';
import styles from './DashboardCard.module.scss';
import { Tooltip } from 'antd';
import { FaCircleInfo } from 'react-icons/fa6';
const cx = classNames.bind(styles);

function DashboardCard({ title, value, percent, borderColor, isActive, onClick, timeComparisonText, tooltipText }) {
    return (
        <div className={cx('card-wrap')} onClick={onClick}>
            <div
                className={cx('card', 'custom-card', 'p-3', 'shadow-sm', { active: isActive })}
                style={{
                    '--border-color': borderColor,
                }}
            >
                <div className="d-flex align-items-center mb-2">
                    <strong className="me-1">{title}</strong>
                    <Tooltip title={tooltipText || 'Thông tin thêm'}>
                        <FaCircleInfo className="text-muted" style={{ cursor: 'pointer' }} />
                    </Tooltip>
                </div>
                <div className="fs-4 fw-bold">{value}</div>
                <div className="text-muted small">{timeComparisonText}</div>
                <div className="text-muted small">{percent}</div>
            </div>
        </div>
    );
}

export default DashboardCard;
