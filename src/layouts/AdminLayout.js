import { Outlet } from 'react-router-dom';

function AdminLayout() {
    return (
        <>
            AdminLayout1
            <Outlet />
            AdminLayout2
        </>
    );
}

export default AdminLayout;
