extern int led0;
extern int led1;
extern int led2;
extern int led3;
int main(int argn, char* argv[])
{
	printf("lizhizhou");
	set_rgb_led(led0, 255,255,255);
	set_rgb_led(led1, 255,0 ,255);
	set_rgb_led(led2, 0 ,255,255);
	set_rgb_led(led3, 255,255,0);
	return 0;
}
