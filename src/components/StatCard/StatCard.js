import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import CountUp from 'react-countup';

import classNames from 'classnames/bind';
import styles from './StatCard.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function StatCard({
    title,
    amount,
    decimals = 0,
    unit,
    percentage,
    link,
    linkLabel,
    iconBg,
    iconColor,
    iconComponent: Icon,
    extraStats = [],
}) {
    const [showAllStats, setShowAllStats] = useState(false);

    const toggleStats = () => setShowAllStats((prev) => !prev);

    return (
        <div className={cx('card', 'card-animate')}>
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0"> {title} </p>
                    </div>
                    <div className="flex-shrink-0">
                        <h5
                            className={`fs-14 mb-0 ${
                                percentage > 0 ? 'text-success' : percentage < 0 ? 'text-danger' : 'text-muted'
                            }`}
                        >
                            {percentage > 0 ? (
                                <FiArrowUpRight className="fs-13 align-middle" />
                            ) : percentage < 0 ? (
                                <FiArrowDownRight className="fs-13 align-middle" />
                            ) : (
                                false
                            )}
                            {percentage} %
                        </h5>
                    </div>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            {unit}
                            &nbsp;
                            <CountUp end={amount} decimals={decimals} duration={1} />
                            &nbsp;
                            {extraStats.length > 0 && (
                                <button
                                    onClick={toggleStats}
                                    className="btn btn-sm btn-link p-0 text-decoration-underline"
                                >
                                    {showAllStats ? 'Ẩn bớt' : 'Xem thêm'}
                                </button>
                            )}
                        </h4>

                        {showAllStats && (
                            <ul className="list-unstyled mb-2">
                                {extraStats.map((item, idx) => (
                                    <li key={idx} className="small text-muted">
                                        {item.label}: <strong>{item.value}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Link to={link} className="text-decoration-underline">
                            {linkLabel}
                        </Link>
                    </div>
                    <div className={cx('avatar-sm', 'flex-shrink-0')}>
                        <span className={cx('avatar-title', 'rounded', 'fs-3', iconBg)}>
                            <Icon className={iconColor} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatCard;
