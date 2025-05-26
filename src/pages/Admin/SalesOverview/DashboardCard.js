import { Tooltip } from 'antd';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import classNames from 'classnames/bind';
import styles from './DashboardCard.module.scss';
import { formatCurrency } from '~/utils';
const cx = classNames.bind(styles);

function DashboardCard({
    title,
    value,
    unit,
    percent,
    borderColor,
    isActive,
    onClick,
    timeComparisonText,
    tooltipText,
}) {
    const renderPercentIcon = () => {
        if (percent > 0) return <FaCaretUp className="text-success ms-1" />;
        if (percent < 0) return <FaCaretDown className="text-danger ms-1" />;
        return null;
    };

    const formatValue = () => {
        if (unit === 'currency') {
            return formatCurrency(value);
        }
        if (unit === 'percent') {
            return `${value} %`;
        }
        return value;
    };

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
                    <Tooltip title={tooltipText}>
                        <FaCircleInfo className="text-muted" style={{ cursor: 'pointer' }} />
                    </Tooltip>
                </div>

                <div className="fs-4 fw-bold mb-1">{formatValue()}</div>

                <div className="d-flex align-items-center">
                    <span>{timeComparisonText}</span>
                    {renderPercentIcon()}
                    <span className="ms-1">{percent}%</span>
                </div>
            </div>
        </div>
    );
}

export default DashboardCard;
