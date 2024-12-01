BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [user_management].[user_pictures] DROP CONSTRAINT [user_pictures_picture_id_fkey];

-- DropForeignKey
ALTER TABLE [user_management].[user_pictures] DROP CONSTRAINT [user_pictures_user_id_fkey];

-- AddForeignKey
ALTER TABLE [user_management].[user_pictures] ADD CONSTRAINT [user_pictures_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [user_management].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [user_management].[user_pictures] ADD CONSTRAINT [user_pictures_picture_id_fkey] FOREIGN KEY ([picture_id]) REFERENCES [user_management].[pictures]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
