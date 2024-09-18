

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // console.log({ file })
    if( !file ) return callback( new Error('Archivo vacío'), false);

    const fileExtension = file.mimetype.split('/')[1].toLowerCase();
    const validExtensions = ['vnd.rar','x-7z-compressed','zip','x-tar','gzip','x-gzip','x-bzip2'];

    if( validExtensions.includes( fileExtension )){
        return callback(null, true)
    }

    callback(null, false);
}