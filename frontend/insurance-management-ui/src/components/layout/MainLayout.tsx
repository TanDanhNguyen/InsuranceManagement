
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Typography,
  Space,
  Badge,
} from "antd";

import {
  DashboardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";

import "./MainLayout.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: "Customers",
    },
    {
      key: "/insurance-products",
      icon: <SafetyCertificateOutlined />,
      label: "Insurance Products",
    },
    {
      key: "/policies",
      icon: <FileProtectOutlined />,
      label: "Policies",
    },
    {
      key: "/claims",
      icon: <FileSearchOutlined />,
      label: "Claims",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        className="sidebar"
      >
        <div className="sidebar-logo">
          <SafetyCertificateOutlined className="logo-icon" />
          {!collapsed && (
            <span className="logo-text">Insurance Management</span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className="main-header">
          <Space size="middle">
            <Button
              type="text"
              icon={
                collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => setCollapsed(!collapsed)}
            />
            <Title level={4} className="header-title">
              Insurance Management System
            </Title>
          </Space>

          <Space size="large">
            <Badge dot>
              <BellOutlined className="header-icon" />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }}>
              <Space className="user-profile">
                <Avatar icon={<UserOutlined />} />
                <div className="user-info">
                  <Text strong>Admin User</Text>
                  <Text type="secondary">Administrator</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
