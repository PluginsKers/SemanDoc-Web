import { getWechatAuthUrl } from "../../api/auth";

const WechatAuthButton = () => {
    const url = getWechatAuthUrl({
        appid: 'wx26a3506fe5255204',
        agentid: '1000031',
    });

    return (
        <a href={url} className="mt-6 inline-block px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">前往授权</a>
    );
};

export default WechatAuthButton;