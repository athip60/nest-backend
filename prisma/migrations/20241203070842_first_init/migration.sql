BEGIN TRY

BEGIN TRAN;

-- CreateSchema
EXEC sp_executesql N'CREATE SCHEMA [user_management];';;

-- CreateTable
CREATE TABLE [user_management].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(255) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [is_delete] BIT NOT NULL CONSTRAINT [user_is_delete_df] DEFAULT 0,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [user_management].[pictures] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [path] VARCHAR(10) NOT NULL,
    [key] NVARCHAR(1000) NOT NULL,
    [type] VARCHAR(5) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [pictures_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [pictures_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [user_management].[user_pictures] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [picture_id] BIGINT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [user_pictures_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [user_pictures_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_pictures_user_id_key] UNIQUE NONCLUSTERED ([user_id]),
    CONSTRAINT [user_pictures_picture_id_key] UNIQUE NONCLUSTERED ([picture_id]),
    CONSTRAINT [user_pictures_user_id_picture_id_key] UNIQUE NONCLUSTERED ([user_id],[picture_id])
);

-- CreateTable
CREATE TABLE [user_management].[user_pictures_log] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [picture_id] BIGINT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [user_pictures_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [user_pictures_log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [user_management].[error_logs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [error_message] NVARCHAR(1000) NOT NULL,
    [exac_message] NVARCHAR(1000) NOT NULL,
    [stack_trace] TEXT,
    [error_code] VARCHAR(50),
    [user_id] INT,
    [url] VARCHAR(255),
    [method] VARCHAR(10),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [error_logs_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [error_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [user_management].[user_pictures] ADD CONSTRAINT [user_pictures_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [user_management].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [user_management].[user_pictures] ADD CONSTRAINT [user_pictures_picture_id_fkey] FOREIGN KEY ([picture_id]) REFERENCES [user_management].[pictures]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [user_management].[user_pictures_log] ADD CONSTRAINT [user_pictures_log_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [user_management].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [user_management].[user_pictures_log] ADD CONSTRAINT [user_pictures_log_picture_id_fkey] FOREIGN KEY ([picture_id]) REFERENCES [user_management].[pictures]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
