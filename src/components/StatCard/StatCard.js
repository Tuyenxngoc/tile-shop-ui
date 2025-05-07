import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import CountUp from 'react-countup';

import './StatCard.scss';

function StatCard({ title, amount, unit, percentage, link, linkLabel, iconBg, iconColor, iconComponent: Icon }) {
    return (
        <div className="card card-animate">
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
                            <CountUp end={amount} decimals={2} duration={1} />
                        </h4>
                        <Link to={link} className="text-decoration-underline">
                            {linkLabel}
                        </Link>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                        <span className={`avatar-title rounded fs-3 ${iconBg}`}>
                            <Icon className={iconColor} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatCard;
