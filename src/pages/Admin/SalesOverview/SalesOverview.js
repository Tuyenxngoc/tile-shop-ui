import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { DatePicker, message, Select } from 'antd';
import dayjs from 'dayjs';

import DashboardCard from './DashboardCard';
import { getChartDataByKeys } from '~/services/statisticsService';
import { formatCurrency } from '~/utils';

const MAX_ACTIVE_KEYS = 4;

const timePeriodOptions = [
    { value: 'day', label: 'Ngày' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' },
];

const titleMap = {
    revenue: 'Doanh số',
    orders: 'Đơn hàng',
    canceled: 'Đơn huỷ',
    conversion: 'Tỷ lệ chuyển đổi',
    visits: 'Lượt truy cập',
    pageviews: 'Lượt xem trang',
};

const colorMap = {
    revenue: '#2673dd',
    orders: '#ff6b45',
    canceled: '#d62728',
    conversion: '#26aa99',
    visits: '#58b7f1',
    pageviews: '#945fb9',
};

const timeComparisonMap = {
    day: 'so với ngày hôm qua',
    week: 'so với tuần trước',
    month: 'so với tháng trước',
    year: 'so với năm trước',
};

const salesMetrics = [
    {
        key: 'revenue',
        title: 'Doanh số',
        value: 0,
        percent: 0,
        tooltip: 'Tổng giá trị của các đơn hàng đã đã giao.',
    },
    {
        key: 'orders',
        title: 'Đơn hàng',
        value: 0,
        percent: 0,
        tooltip:
            'Tổng số đơn đặt hàng đã xác nhận trong khoảng thời gian đã chọn, bao gồm cả đơn đặt hàng đã hủy và trả lại / hoàn tiền.',
    },
    {
        key: 'canceled',
        title: 'Đơn đã huỷ',
        value: 0,
        percent: 0,
        tooltip: 'Tổng số đơn đặt hàng đã hủy trong khoảng thời gian đã chọn',
    },
    {
        key: 'conversion',
        title: 'Tỷ lệ chuyển đổi',
        value: 0,
        percent: 0,
        tooltip:
            'Tổng số khách truy cập và có đơn đã xác nhận chia tổng số khách truy cập trong khoảng thời gian đã chọn',
    },
    {
        key: 'visits',
        title: 'Lượt truy cập',
        value: 0,
        percent: 0,
        tooltip:
            'Tổng số khách truy cập duy nhất đã xem trang chủ hoặc trang sản phẩm của Shop trong khoảng thời gian được chọn. Mỗi khách xem một trang sản phẩm nhiều lần được tính là khách truy cập duy nhất.',
    },
    {
        key: 'pageviews',
        title: 'Lượt xem trang',
        value: 0,
        percent: 0,
        tooltip:
            'Tổng số lượt xem trang chủ hoặc trang sản phẩm của Shop trong khoảng thời gian được chọn (từ Máy tính và Ứng dụng)',
    },
];

const formatLabel = (timestamp, statType) => {
    switch (statType) {
        case 'day':
            return dayjs.unix(timestamp).format('HH:mm'); // giờ phút trong ngày
        case 'week':
            return dayjs.unix(timestamp).format('DD/MM'); // ngày/tháng trong tuần
        case 'month':
            return dayjs.unix(timestamp).format('DD'); // ngày trong tháng
        case 'year':
            return dayjs.unix(timestamp).format('MM/YYYY'); // tháng/năm
        default:
            return dayjs.unix(timestamp).format('DD/MM');
    }
};

const formatValue = (key, value) => {
    switch (key) {
        case 'revenue':
            return formatCurrency(value);
        case 'conversion':
            return `${(value * 100).toFixed(2)}%`;
        default:
            return Math.round(value);
    }
};

function SalesOverview() {
    const [activeKeys, setActiveKeys] = useState(['revenue']);
    const [metricsData, setMetricsData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const [chartDate, setChartDate] = useState(dayjs());
    const [statType, setStatType] = useState('week');

    const toggleActive = (key) => {
        if (activeKeys.includes(key) && activeKeys.length === 1) {
            messageApi.warning('Vui lòng chọn tối thiểu 1 chỉ tiêu');
            return;
        }

        if (!activeKeys.includes(key) && activeKeys.length >= MAX_ACTIVE_KEYS) {
            messageApi.warning(`Chỉ được chọn tối đa ${MAX_ACTIVE_KEYS} chỉ tiêu`);
            return;
        }

        setActiveKeys((prev) => {
            if (prev.includes(key)) {
                return prev.filter((k) => k !== key);
            } else if (prev.length < MAX_ACTIVE_KEYS) {
                return [...prev, key];
            } else {
                return prev;
            }
        });
    };

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await getChartDataByKeys({
                    date: chartDate.format('YYYY-MM-DD'),
                    type: statType,
                    keys: activeKeys,
                });
                const chart = response.data.data;

                const formatted = Object.entries(chart).map(([key, metric]) => {
                    const total = metric.value === 0 ? 1 : metric.value;
                    return {
                        id: key,
                        data: metric.points.map((p) => ({
                            x: formatLabel(p.timestamp, statType),
                            y: p.value / total, // chuẩn hóa theo phần trăm của tổng
                            originalValue: p.value,
                        })),
                    };
                });

                setMetricsData(formatted);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                messageApi.error(errorMessage);
            }
        };

        fetchChartData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKeys, chartDate, statType]);

    return (
        <div>
            {contextHolder}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Tổng quan</h2>
                <div className="d-flex gap-2">
                    <Select
                        value={statType}
                        onChange={(value) => setStatType(value)}
                        options={timePeriodOptions}
                        style={{ width: 120 }}
                    />
                    <DatePicker
                        name="chartDate"
                        picker={statType}
                        value={chartDate}
                        onChange={(date) => setChartDate(date)}
                        format={statType === 'year' ? 'YYYY' : statType === 'month' ? 'MM/YYYY' : 'DD/MM/YYYY'}
                        allowClear={false}
                    />
                </div>
            </div>

            <div className="row g-3 mb-3">
                {salesMetrics.map((item) => (
                    <div className="col-2" key={item.key}>
                        <DashboardCard
                            title={item.title}
                            value={item.value}
                            percent={item.percent}
                            borderColor={colorMap[item.key] || '#000'}
                            isActive={activeKeys.includes(item.key)}
                            onClick={() => toggleActive(item.key)}
                            timeComparisonText={timeComparisonMap[statType] || ''}
                            tooltipText={item.tooltip}
                        />
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">Biểu đồ</h4>
                <small>Đã chọn {activeKeys.length} / 4</small>
            </div>

            <div style={{ height: '500px' }}>
                <ResponsiveLine
                    data={metricsData}
                    colors={({ id }) => colorMap[id] || '#000'}
                    margin={{ top: 50, right: 140, bottom: 50, left: 60 }}
                    yScale={{ type: 'linear', min: 0, max: 1, reverse: false }}
                    axisLeft={{ legend: 'Tỉ lệ', legendOffset: -40 }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'seriesColor' }}
                    pointLabelYOffset={-12}
                    enableTouchCrosshair={true}
                    useMesh={true}
                    animate={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            translateX: 120,
                            itemWidth: 100,
                            itemHeight: 24,
                            symbolShape: 'circle',
                            data: metricsData.map((line) => ({
                                id: line.id,
                                label: titleMap[line.id] || line.id,
                                color: colorMap[line.id] || '#000',
                            })),
                        },
                    ]}
                    tooltip={({ point }) => {
                        const { x } = point.data;

                        const valuesAtX = metricsData.map((series) => {
                            const pointAtX = series.data.find((d) => d.x === x);
                            return {
                                id: series.id,
                                color: colorMap[series.id],
                                value: pointAtX?.originalValue ?? 0,
                            };
                        });

                        return (
                            <div
                                style={{
                                    background: 'white',
                                    padding: 10,
                                    minWidth: '200px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <div>
                                    <strong>{x}</strong>
                                </div>
                                {valuesAtX.map(({ id, color, value }) => (
                                    <div key={id} style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                                        <span
                                            style={{
                                                width: 10,
                                                height: 10,
                                                background: color,
                                                borderRadius: '50%',
                                                marginRight: 6,
                                            }}
                                        />
                                        <span style={{ flex: 1 }}>{titleMap[id] || id}</span>
                                        <span style={{ marginLeft: 8 }}>{formatValue(id, value)}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}

export default SalesOverview;
