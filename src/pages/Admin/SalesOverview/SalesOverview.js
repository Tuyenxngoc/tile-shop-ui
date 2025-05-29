import { useEffect, useMemo, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Button, DatePicker, message, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

import { formatCurrency } from '~/utils';
import { exportChartData, getChartData } from '~/services/statisticsService';
import { OverviewStatCard } from '~/components/StatCard';

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
    conversion: 'Tỷ lệ chuyển đổi',
    visits: 'Lượt truy cập',
    pageviews: 'Lượt xem trang',
};

const colorMap = {
    revenue: '#2673dd',
    orders: '#ff6b45',
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
        tooltip: 'Tổng giá trị của các đơn hàng đã giao trong khoảng thời gian đã chọn.',
        unit: 'currency',
    },
    {
        key: 'orders',
        title: 'Đơn hàng',
        value: 0,
        percent: 0,
        tooltip: 'Tổng số đơn đặt hàng trong khoảng thời gian đã chọn, bao gồm cả đơn đặt hàng đã hủy và trả lại.',
    },
    {
        key: 'conversion',
        title: 'Tỷ lệ chuyển đổi',
        value: 0,
        percent: 0,
        tooltip: 'Tổng số khách truy cập và có đơn chia tổng số khách truy cập trong khoảng thời gian đã chọn',
        unit: 'percent',
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
        tooltip: 'Tổng số lượt xem trang chủ hoặc trang sản phẩm của Shop trong khoảng thời gian được chọn.',
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
            return `${value}%`;
        default:
            return Math.round(value);
    }
};

function SalesOverview() {
    const [activeKeys, setActiveKeys] = useState(['revenue']);
    const [metricsData, setMetricsData] = useState([]);
    const [metricCardsData, setMetricCardsData] = useState(salesMetrics);
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

    const handleExportReport = async () => {
        try {
            const response = await exportChartData({
                date: chartDate.format('YYYY-MM-DD'),
                type: statType,
            });
            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'shop-stats.xlsx';
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (fileNameMatch && fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                    }
                }
                saveAs(blob, fileName);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            messageApi.error(errorMessage);
        }
    };

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await getChartData({
                    date: chartDate.format('YYYY-MM-DD'),
                    type: statType,
                });
                const chart = response.data.data;

                const formatted = Object.entries(chart).map(([key, metric]) => {
                    const values = metric.points.map((p) => p.value);
                    const min = Math.min(...values);
                    const max = Math.max(...values);
                    const range = max - min || 1;

                    return {
                        id: key,
                        data: metric.points.map((p) => ({
                            x: formatLabel(p.timestamp, statType),
                            y: (p.value - min) / range,
                            originalValue: p.value,
                        })),
                    };
                });

                const updatedMetrics = salesMetrics.map((item) => {
                    const metric = chart[item.key];
                    if (metric) {
                        return {
                            ...item,
                            value: metric.value,
                            percent: metric.chainRatio,
                        };
                    }
                    return item;
                });

                setMetricsData(formatted);
                setMetricCardsData(updatedMetrics);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                messageApi.error(errorMessage);
            }
        };

        fetchChartData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartDate, statType]);

    const filteredMetricsData = useMemo(() => {
        return metricsData.filter((line) => activeKeys.includes(line.id));
    }, [metricsData, activeKeys]);

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

                    <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
                        Tải dữ liệu
                    </Button>
                </div>
            </div>

            <div
                className="d-grid"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}
            >
                {metricCardsData.map((item) => (
                    <OverviewStatCard
                        key={item.key}
                        title={item.title}
                        value={item.value}
                        unit={item.unit}
                        percent={item.percent}
                        borderColor={colorMap[item.key] || '#000'}
                        isActive={activeKeys.includes(item.key)}
                        onClick={() => toggleActive(item.key)}
                        timeComparisonText={timeComparisonMap[statType] || ''}
                        tooltipText={item.tooltip}
                    />
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">Biểu đồ</h4>
                <small>Đã chọn {activeKeys.length} / 4</small>
            </div>

            <div style={{ height: '400px' }}>
                <ResponsiveLine
                    data={filteredMetricsData}
                    colors={({ id }) => colorMap[id] || '#000'}
                    margin={{ top: 50, right: 140, bottom: 50, left: 60 }}
                    yScale={{ type: 'linear', min: 0, max: 1, reverse: false }}
                    axisLeft={null}
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
                            data: filteredMetricsData.map((line) => ({
                                id: line.id,
                                label: titleMap[line.id] || line.id,
                                color: colorMap[line.id] || '#000',
                            })),
                        },
                    ]}
                    tooltip={({ point }) => {
                        const { x } = point.data;

                        const valuesAtX = filteredMetricsData.map((series) => {
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
                                    background: '#fff',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 6,
                                    minWidth: 180,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    fontSize: 13,
                                }}
                            >
                                <div
                                    style={{
                                        color: '#333',
                                        backgroundColor: '#f6f6f6',
                                        padding: '4px 6px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {x}
                                </div>

                                <div style={{ padding: '6px' }}>
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
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}

export default SalesOverview;
