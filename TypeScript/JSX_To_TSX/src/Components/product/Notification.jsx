function Notification({ notification }) {
    if (!notification) return null;

    return (
        <div className={`notification notification-${notification.type}`}>
            <p>{notification.message}</p>
        </div>
    );
}

export default Notification;