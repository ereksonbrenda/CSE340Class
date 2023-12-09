INSERT INTO public.account(
	account_id, account_firstname, account_lastname, account_email, account_password, account_type)
	VALUES ('1','tony','stark','tony@starkent.com','Iam1ronM@n','Client');

UPDATE public.account
	SET account_type= Admin
	WHERE account_id = '1';

DELETE FROM public.account
	WHERE account_id = 1;


UPDATE public.inv
	SET inv_description='small interiors', 'a huge interior'
	WHERE account_id = 10;

SELECT inv_model,inv_make,
classification
FROM
inv
INNER JOIN classification
ON inv.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

UPDATE public.inv
SET inv_image = REPLACE(inv_image, 'image', 'image/vehicle');
UPDATE public.inv
SET inv_thumbnail = REPLACE(inv_thumbnail, 'image', 'image/vehicle');


