export const lastProfileFileName = './lastProfile.txt';

export const validProfiles = ['minecraft', 'arma3'];

export const timeToWordFormat = (timeInSeconds: number) => {
    let word = 'seconds';
    if (timeInSeconds > 60) word = 'minutes';
    if (timeInSeconds > 600) word = 'hours';
    return word;
};
