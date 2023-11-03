import axios from 'axios';

// export const getPlayerCount = async (server: any) => {
//     console.log(server);
//     return 1;
// };

// export const getServerStatus = async (server: any) => {
//     console.log(server);
//     return 'idk';
// };

export const getExternalIp = async (): Promise<string> => {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const { ip } = response.data;

    return ip;
};

export const getPort = async (): Promise<number> => {
    // TODO: Find unused port
    return 46286;
};
