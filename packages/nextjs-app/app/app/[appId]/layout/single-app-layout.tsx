"use client";
import {
	AppContextProvider,
	ICurrentApp,
	IDifyChatContextSingleApp,
} from "@dify-chat/core";
import { useDifyChat } from "@dify-chat/core";
import { useMount, useRequest } from "ahooks";
import { Spin } from "antd";
import React, { useState } from "react";

import { useAppSiteSetting, useDifyApi } from "@/hooks/useApi";

import MainLayout from "@/app/app/[appId]/layout/main-layout";

const SingleAppLayout: React.FC = () => {
	const difyChatContext = useDifyChat();
	const { user, appConfig } = difyChatContext as IDifyChatContextSingleApp;
	const [selectedAppId, setSelectedAppId] = useState("");
	const [initLoading, setInitLoading] = useState(false);
	const [currentApp, setCurrentApp] = useState<ICurrentApp>(); // 新增 currentApp 状态用于保存当前应用的 inf

	const difyApi = useDifyApi({
		user,
		appId: appConfig.id,
	});

	const { runAsync: getAppParameters } = useRequest(
		() => {
			return difyApi.getAppParameters();
		},
		{
			manual: true,
		},
	);

	const { getAppSiteSettting } = useAppSiteSetting();

	const initInSingleMode = async () => {
		setSelectedAppId(appConfig.id);
		setInitLoading(true);
		const [difyAppInfo, appParameters, appSiteSetting] = await Promise.all([
			difyApi.getAppInfo(),
			getAppParameters(),
			getAppSiteSettting(difyApi),
		]);
		// 获取应用信息
		setCurrentApp({
			config: {
				id: appConfig.id,
				...appConfig,
				info: {
					...difyAppInfo,
					// 这里使用用户传入配置覆盖接口获取到的信息，是为了兼容旧版本(<=v1.3.1)的 /info 接口没有返回 mode 的情况
					...appConfig.info,
				},
			},
			parameters: appParameters,
			site: appSiteSetting,
		});
		setInitLoading(false);
	};

	// 初始化获取应用列表
	useMount(() => {
		initInSingleMode();
	});

	if (initLoading) {
		return (
			<div className="absolute w-full h-full left-0 top-0 z-50 flex items-center justify-center">
				<Spin spinning />
			</div>
		);
	}

	return currentApp && selectedAppId ? (
		<AppContextProvider
			value={{
				appLoading: initLoading,
				currentAppId: selectedAppId,
				setCurrentAppId: setSelectedAppId,
				currentApp: currentApp,
				setCurrentApp,
			}}
		>
			<MainLayout
				// difyApi={difyApi}
				initLoading={false}
				renderCenterTitle={(appInfo) => {
					return <>{appInfo?.name}</>;
				}}
			/>
		</AppContextProvider>
	) : null;
};

export default SingleAppLayout;
