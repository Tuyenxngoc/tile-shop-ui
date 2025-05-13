import { Outlet } from 'react-router-dom';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import Navbar from '~/components/Navbar';
import Contact from '~/components/Contact';
import ChatBox from '~/components/ChatBox';

function DefaultLayout() {
    return (
        <>
            <Header />
            <Navbar />
            <Outlet />
            <Footer />
            <Contact contactNumber="0984176999" />
            <ChatBox />
        </>
    );
}

export default DefaultLayout;
