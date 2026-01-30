import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AssetPage from './pages/AssetPage';
import AddEditAssetPage from './pages/AddEditAssetPage';
import { AuthContext } from './context/AuthContext';

function App() {
	const { user } = useContext(AuthContext);
	const Private = ({ children }) => user ? children : <Navigate to="/login" />;
	
	// Layout wrapper that includes header & nav
	const LayoutWithNav = ({ children }) => (
		<HomePage>
			{children}
		</HomePage>
	);

	return (
		<div className="App">
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<Navigate to={user ? '/home' : '/login'} />} />
				
				<Route path="/home" element={<Private><HomePage /></Private>} />
				<Route path="/dashboard" element={<Private><LayoutWithNav><DashboardPage /></LayoutWithNav></Private>} />
				<Route path="/assets" element={<Private><LayoutWithNav><AssetPage /></LayoutWithNav></Private>} />
				<Route path="/assets/new" element={<Private><LayoutWithNav><AddEditAssetPage /></LayoutWithNav></Private>} />
				<Route path="/assets/:id/edit" element={<Private><LayoutWithNav><AddEditAssetPage /></LayoutWithNav></Private>} />
				
				<Route path="*" element={<div style={{padding:20}}>Page not found</div>} />
			</Routes>
		</div>
	);
}

export default App;
