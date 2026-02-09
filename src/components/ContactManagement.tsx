import React, { useState } from 'react';
import { Mail, Clock, CheckCircle, Package, Trash2, Eye, X } from 'lucide-react';
import { useContacts } from '../contexts/ContactContext';
import { ContactMessage } from '../types';
import toast from 'react-hot-toast';

export const ContactManagement: React.FC = () => {
  const { messages, updateMessageStatus, deleteMessage } = useContacts();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'fulfilled'>('all');

  const filteredMessages = messages.filter(message => 
    filter === 'all' || message.status === filter
  );

  const getStatusIcon = (status: ContactMessage['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'fulfilled':
        return <Package className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const handleStatusChange = (id: string, status: ContactMessage['status']) => {
    updateMessageStatus(id, status);
    toast.success(`Message marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(id);
      toast.success('Message deleted successfully');
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contact Messages</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'approved', 'fulfilled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 text-xs">
                  ({messages.filter(m => m.status === status).length})
                </span>
              )}
              {status === 'all' && (
                <span className="ml-1 text-xs">({messages.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {message.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span>{message.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                    {message.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(message.timestamp)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                {message.message}
              </p>

              <div className="flex space-x-2">
                {message.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(message.id, 'approved')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Approve
                  </button>
                )}
                {message.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(message.id, 'fulfilled')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Mark Fulfilled
                  </button>
                )}
                {message.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange(message.id, 'pending')}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                  >
                    Mark Pending
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Message Details
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white">{selectedMessage.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{selectedMessage.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(selectedMessage.timestamp)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 w-fit ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusIcon(selectedMessage.status)}
                  <span>{selectedMessage.status}</span>
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              {selectedMessage.status === 'pending' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedMessage.id, 'approved');
                    setSelectedMessage(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Approve
                </button>
              )}
              {selectedMessage.status === 'approved' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedMessage.id, 'fulfilled');
                    setSelectedMessage(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Mark Fulfilled
                </button>
              )}
              <button
                onClick={() => {
                  handleDelete(selectedMessage.id);
                  setSelectedMessage(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};