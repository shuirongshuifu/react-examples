export const downloadFile = (response: any, fileName: string) => {
    // 如果response是axios响应对象
    if (response && response.data) {
        const blob = new Blob([response.data], { 
            type: response.headers['content-type'] || 'application/vnd.ms-excel' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        // 如果response直接是blob数据
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}