import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
    status: 'pending' | 'ready' | 'delivered';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        ready: 'bg-blue-100 text-blue-800',
        delivered: 'bg-green-100 text-green-800',
    };

    return (
        <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', styles[status] || styles.pending)}>
            {status}
        </span>
    );
};

export default StatusBadge;
