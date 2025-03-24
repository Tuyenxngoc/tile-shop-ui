import { Layout } from 'antd';
import dayjs from 'dayjs';

const { Footer } = Layout;

function AdminFooter() {
    return <Footer style={{ textAlign: 'center' }}>{dayjs().year()} All Rights Reserved By © Tuyenngoc</Footer>;
}

export default AdminFooter;
