import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Alert } from 'antd';
import { UserOutlined, DesktopOutlined, MobileOutlined, ChromeOutlined, GlobalOutlined, WindowsOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  deviceStats: Array<{
    device_type: string;
    _count: number;
  }>;
  browserStats: Array<{
    browser: string;
    _count: number;
  }>;
}

interface ActiveSession {
  session_id: string;
  user_id: string;
  session_type: string;
  ip_address: string;
  device_type: string;
  browser: string;
  os: string;
  login_time: string;
  users: {
    email: string;
    username: string;
  };
}

const SessionStats: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [statsResponse, sessionsResponse] = await Promise.all([
          axios.get('/sessions/stats/admin', config),
          axios.get('/sessions/active/admin', config)
        ]);

        setStats(statsResponse.data);
        setActiveSessions(sessionsResponse.data);
      } catch (error) {
        console.error('Error fetching session stats:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError(t('common.unauthorized'));
          } else {
            setError(t('sessions.errorLoading'));
          }
        } else {
          setError(t('sessions.errorLoading'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [t]);

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mobile':
        return <MobileOutlined />;
      case 'tablet':
        return <DesktopOutlined />;
      default:
        return <DesktopOutlined />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser?.toLowerCase()) {
      case 'chrome':
        return <ChromeOutlined />;
      case 'safari':
        return <GlobalOutlined />;
      default:
        return <GlobalOutlined />;
    }
  };

  const columns = [
    {
      title: t('sessions.user'),
      dataIndex: ['users', 'email'],
      key: 'email',
    },
    {
      title: t('sessions.device'),
      dataIndex: 'device_type',
      key: 'device_type',
      render: (text: string) => (
        <span>
          {getDeviceIcon(text)} {text}
        </span>
      ),
    },
    {
      title: t('sessions.browser'),
      dataIndex: 'browser',
      key: 'browser',
      render: (text: string) => (
        <span>
          {getBrowserIcon(text)} {text}
        </span>
      ),
    },
    {
      title: t('sessions.os'),
      dataIndex: 'os',
      key: 'os',
      render: (text: string) => (
        <span>
          <WindowsOutlined /> {text}
        </span>
      ),
    },
    {
      title: t('sessions.loginTime'),
      dataIndex: 'login_time',
      key: 'login_time',
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('sessions.totalSessions')}
              value={stats?.totalSessions}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('sessions.activeSessions')}
              value={stats?.activeSessions}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('sessions.deviceTypes')}
              value={stats?.deviceStats.length}
              prefix={<DesktopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title={t('sessions.deviceDistribution')}>
            {stats?.deviceStats.map((stat) => (
              <div key={stat.device_type} style={{ marginBottom: '8px' }}>
                {getDeviceIcon(stat.device_type)} {stat.device_type}: {stat._count}
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('sessions.browserDistribution')}>
            {stats?.browserStats.map((stat) => (
              <div key={stat.browser} style={{ marginBottom: '8px' }}>
                {getBrowserIcon(stat.browser)} {stat.browser}: {stat._count}
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Card title={t('sessions.activeUsers')} style={{ marginTop: '16px' }}>
        <Table
          columns={columns}
          dataSource={activeSessions}
          rowKey="session_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default SessionStats; 