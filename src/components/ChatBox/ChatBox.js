import { useState, useRef, useEffect } from 'react';
import { Button, Input } from 'antd';
import { IoMdChatboxes } from 'react-icons/io';
import { CloseOutlined } from '@ant-design/icons';
import { marked } from 'marked';

import { createChatAI } from '~/services/chatService';

import classNames from 'classnames/bind';
import styles from './ChatBox.module.scss';

const cx = classNames.bind(styles);

const sampleQuestions = ['Làm thế nào để đặt hàng?', 'Thông tin cửa hàng?', 'Các sản phẩm bán chạy?'];

function ChatBox() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messageEndRef = useRef(null);

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const handleSendMessage = async () => {
        if (messageInput.trim() === '') return;

        const userMessage = { role: 'user', content: messageInput };
        const conversation = chatMessages.map((msg) => ({
            role: msg.role,
            content: msg.role === 'model' ? msg.raw : msg.content,
        }));

        setChatMessages((prev) => [...prev, userMessage]);
        setMessageInput('');
        setIsLoading(true);
        try {
            const response = await createChatAI({ message: messageInput, conversation });
            if (response.status === 200) {
                const markdownText = response.data.data;
                const htmlText = marked.parse(markdownText);

                const aiMessage = { role: 'model', content: htmlText, raw: markdownText };
                setChatMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            setChatMessages((prev) => [
                ...prev,
                {
                    role: 'model',
                    content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <>
            {/* Floating chat button */}
            <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<IoMdChatboxes style={{ fontSize: '24px' }} />}
                onClick={toggleChat}
                className="position-fixed"
                style={{
                    width: '50px',
                    height: '50px',
                    bottom: 150,
                    right: 20,
                    zIndex: 9999,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
            />

            {/* Chat popup */}
            {isChatOpen && (
                <div
                    className="position-fixed bg-white border rounded d-flex flex-column"
                    style={{
                        bottom: 90,
                        right: 20,
                        width: 320,
                        height: 420,
                        zIndex: 99999,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Header */}
                    <div className={cx('header')}>
                        <span className={cx('header-title')}>Tư vấn trực tuyến</span>
                        <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={toggleChat}
                            style={{ color: 'white', boxShadow: 'none' }}
                        />
                    </div>

                    {/* Message list */}
                    <div className="flex-grow-1 p-2 overflow-auto bg-light">
                        {chatMessages.length === 0 ? (
                            <div className="text-muted mb-3">
                                <div className="mb-2">Bạn có thể thử các câu hỏi sau:</div>
                                {sampleQuestions.map((q, i) => (
                                    <Button
                                        key={i}
                                        size="small"
                                        type="default"
                                        className="me-1 mb-1"
                                        onClick={() => setMessageInput(q)}
                                    >
                                        {q}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            chatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-2 ${
                                        msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                                    }`}
                                >
                                    <div
                                        className={cx(
                                            'p-2',
                                            'rounded',
                                            msg.role === 'user' ? 'user-message' : 'bot-message',
                                        )}
                                        style={{
                                            maxWidth: '75%',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                        }}
                                        dangerouslySetInnerHTML={{ __html: msg.content }}
                                    />
                                </div>
                            ))
                        )}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-2 border-top d-flex">
                        <Input
                            name="chat-input"
                            maxLength={255}
                            readOnly={isLoading}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn..."
                            className="me-2"
                        />
                        <Button type="primary" loading={isLoading} onClick={handleSendMessage}>
                            Gửi
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBox;
