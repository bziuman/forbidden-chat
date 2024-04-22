import { AvatarPathDto } from 'src/auth/dto/avatarPath.dto';
import * as path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { SaveAvatarDto } from './dto/saveAvatar.dto';

export const saveAvatar = async (
  data: SaveAvatarDto,
): Promise<AvatarPathDto> => {
  const { username, fileAvatar } = data;
  if (!fileAvatar) return { success: false, path: '' };
  const pathAvatarSave = path.join(
    `/Users/bohdanziuman/Desktop/forbidden-chat/upload-files/UsersAvatars`,
    `${username}${fileAvatar.originalname}`,
  );

  await writeFile(pathAvatarSave, fileAvatar.buffer);

  return { success: true, path: pathAvatarSave };
};
