import ImageKit from "@imagekit/nodejs";

const ImageKitClient = new ImageKit({
  privateKey: "private_m1zxLjF9HI/htcOFDe8OIkZ81Io=",
});

async function uploadFile(file) {
  const result = await ImageKitClient.files.upload({
    file,
    fileName: "Company" + Date.now(),
    folder: "Company-profile-pics",
  });
  return result;
}

export { uploadFile };
