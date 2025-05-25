import { ResponsiveLine } from '@nivo/line';
import DashboardCard from './DashboardCard';
import { useState } from 'react';
import { message } from 'antd';

const data = [
    {
        id: 'japan',
        data: [
            {
                x: 'plane',
                y: 6,
            },
            {
                x: 'helicopter',
                y: 288,
            },
            {
                x: 'boat',
                y: 158,
            },
            {
                x: 'train',
                y: 48,
            },
            {
                x: 'subway',
                y: 196,
            },
            {
                x: 'bus',
                y: 163,
            },
            {
                x: 'car',
                y: 132,
            },
            {
                x: 'moto',
                y: 97,
            },
            {
                x: 'bicycle',
                y: 48,
            },
            {
                x: 'horse',
                y: 29,
            },
            {
                x: 'skateboard',
                y: 9,
            },
            {
                x: 'others',
                y: 17,
            },
        ],
    },
    {
        id: 'us',
        data: [
            {
                x: 'plane',
                y: 252,
            },
            {
                x: 'helicopter',
                y: 207,
            },
            {
                x: 'boat',
                y: 225,
            },
            {
                x: 'train',
                y: 94,
            },
            {
                x: 'subway',
                y: 11,
            },
            {
                x: 'bus',
                y: 282,
            },
            {
                x: 'car',
                y: 22,
            },
            {
                x: 'moto',
                y: 4,
            },
            {
                x: 'bicycle',
                y: 219,
            },
            {
                x: 'horse',
                y: 195,
            },
            {
                x: 'skateboard',
                y: 25,
            },
            {
                x: 'others',
                y: 217,
            },
        ],
    },
    {
        id: 'germany',
        data: [
            {
                x: 'plane',
                y: 22,
            },
            {
                x: 'helicopter',
                y: 112,
            },
            {
                x: 'boat',
                y: 254,
            },
            {
                x: 'train',
                y: 219,
            },
            {
                x: 'subway',
                y: 141,
            },
            {
                x: 'bus',
                y: 53,
            },
            {
                x: 'car',
                y: 71,
            },
            {
                x: 'moto',
                y: 149,
            },
            {
                x: 'bicycle',
                y: 7,
            },
            {
                x: 'horse',
                y: 173,
            },
            {
                x: 'skateboard',
                y: 147,
            },
            {
                x: 'others',
                y: 130,
            },
        ],
    },
    {
        id: 'norway',
        data: [
            {
                x: 'plane',
                y: 166,
            },
            {
                x: 'helicopter',
                y: 193,
            },
            {
                x: 'boat',
                y: 215,
            },
            {
                x: 'train',
                y: 241,
            },
            {
                x: 'subway',
                y: 206,
            },
            {
                x: 'bus',
                y: 277,
            },
            {
                x: 'car',
                y: 225,
            },
            {
                x: 'moto',
                y: 27,
            },
            {
                x: 'bicycle',
                y: 187,
            },
            {
                x: 'horse',
                y: 50,
            },
            {
                x: 'skateboard',
                y: 106,
            },
            {
                x: 'others',
                y: 156,
            },
        ],
    },
];

const data2 = [
    { key: 'sales', title: 'Doanh số', value: '₫ 0', percent: '0,00%' },
    { key: 'orders', title: 'Đơn hàng', value: '0', percent: '0,00%' },
    { key: 'canceled', title: 'Đơn đã huỷ', value: '0', percent: '0,00%' },
    { key: 'conversion', title: 'Tỷ lệ chuyển đổi', value: '0,00%', percent: '0,00%' },
    { key: 'visits', title: 'Lượt truy cập', value: '0', percent: '0,00%' },
    { key: 'pageviews', title: 'Lượt xem trang', value: '0', percent: '0,00%' },
];

function SalesOverview() {
    const [activeKeys, setActiveKeys] = useState(['sales']);

    const [messageApi, contextHolder] = message.useMessage();

    const toggleActive = (key) => {
        setActiveKeys((prev) => {
            if (prev.includes(key)) {
                if (prev.length === 1) {
                    messageApi.warning('Vui lòng chọn tối thiểu 1 chỉ tiêu');
                    return prev;
                }
                return prev.filter((k) => k !== key);
            } else if (prev.length < 4) {
                return [...prev, key];
            } else {
                return prev;
            }
        });
    };

    return (
        <div>
            {contextHolder}

            <h2 className="mb-3">Tổng quan</h2>

            <div className="row g-3">
                {data2.map((item) => (
                    <div className="col-2" key={item.key}>
                        <DashboardCard
                            title={item.title}
                            value={item.value}
                            percent={item.percent}
                            isActive={activeKeys.includes(item.key)}
                            onClick={() => toggleActive(item.key)}
                        />
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Biểu đồ</h6>
                <small>Đã chọn {activeKeys.length} / 4</small>
            </div>

            <div style={{ height: '500px' }}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    axisBottom={{ legend: 'transportation', legendOffset: 36 }}
                    axisLeft={{ legend: 'count', legendOffset: -40 }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'seriesColor' }}
                    pointLabelYOffset={-12}
                    enableTouchCrosshair={true}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            translateX: 100,
                            itemWidth: 80,
                            itemHeight: 22,
                            symbolShape: 'circle',
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default SalesOverview;
